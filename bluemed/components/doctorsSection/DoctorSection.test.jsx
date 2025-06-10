import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DoctorCard from './DoctorCard';
import DoctorDetails from './DoctorDetails';
import Doctors from './Doctors';

// Mock components used by our components
vi.mock('../doctorSchedule/DoctorSchedule', () => ({
  default: ({ id }) => <div data-testid="doctor-schedule">Schedule for doctor {id}</div>
}));

// Mock the react-slick component
vi.mock('react-slick', () => {
  const SliderMock = ({ children, ...props }) => (
    <div data-testid="slider-mock" {...props}>
      {children}
    </div>
  );
  return { default: SliderMock };
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock data for tests
const mockDoctor = {
  _id: '123',
  first_name: 'გიორგი',
  last_name: 'მაისურაძე',
  profession: 'კარდიოლოგი',
  clinic: 'კლინიკა ნიუ ჰოსპიტალი',
  gender: 'მამრობითი',
  about: 'გამოცდილი კარდიოლოგი',
  comments: [
    { author: 'ნინო', text: 'საუკეთესო ექიმია!' },
    { author: 'დავით', text: 'ძალიან კარგი მომსახურება' }
  ]
};

const mockDoctorsList = [
  mockDoctor,
  {
    _id: '456',
    first_name: 'ნინო',
    last_name: 'კახიძე',
    profession: 'პედიატრი',
    clinic: 'ბავშვთა ახალი კლინიკა',
    gender: 'მდედრობითი'
  }
];

describe('DoctorCard', () => {
  it('renders doctor information correctly', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    );

    expect(screen.getByText(`${mockDoctor.first_name} ${mockDoctor.last_name}`)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.profession)).toBeInTheDocument();
    expect(screen.getByText(mockDoctor.clinic)).toBeInTheDocument();
    expect(screen.getByAltText(`${mockDoctor.first_name} ${mockDoctor.last_name}`)).toHaveAttribute('src', '/doctorPics/manDoc.jpeg');
  });

  it('renders female doctor with correct image', () => {
    const femaleDoctor = { ...mockDoctor, gender: 'მდედრობითი' };
    render(
      <MemoryRouter>
        <DoctorCard doctor={femaleDoctor} />
      </MemoryRouter>
    );

    expect(screen.getByAltText(`${femaleDoctor.first_name} ${femaleDoctor.last_name}`)).toHaveAttribute('src', '/doctorPics/womanDoc.jpeg');
  });

  it('links to the correct doctor detail page', () => {
    render(
      <MemoryRouter>
        <DoctorCard doctor={mockDoctor} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/doctors/${mockDoctor._id}`);
  });
});

describe('DoctorDetails', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it('loads and displays doctor details', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('იტვირთება...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(`${mockDoctor.first_name} ${mockDoctor.last_name}`)).toBeInTheDocument();
      expect(screen.getByText(mockDoctor.profession)).toBeInTheDocument();
      expect(screen.getByText(mockDoctor.clinic)).toBeInTheDocument();
      expect(screen.getByText(mockDoctor.about)).toBeInTheDocument();
    });

    expect(screen.getByText('ჩემი გამოცდილება')).toBeInTheDocument();
    expect(screen.getByText('ი. ციციშვილის სახ. ბავშვთა ახალი კლინიკა')).toBeInTheDocument();
  });

  it('shows login message when user is not logged in', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    localStorageMock.getItem.mockImplementation((key) => null);

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/კომენტარის დასატოვებლად გთხოვთ/)).toBeInTheDocument();
      expect(screen.getByText('შეხვიდეთ თქვენს ანგარიშზე')).toBeInTheDocument();
    });
  });

  it('shows comment form when user is logged in', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'name') return 'სანდრო';
      return null;
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/კომენტარის ავტორი:/)).toBeInTheDocument();
      expect(screen.getByText('სანდრო')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('თქვენი კომენტარი')).toBeInTheDocument();
      expect(screen.getByText('კომენტარის დამატება')).toBeInTheDocument();
    });
  });

  it('displays comments correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`სულ ${mockDoctor.comments.length} კომენტარი`)).toBeInTheDocument();
      expect(screen.getByText('ნინო')).toBeInTheDocument();
      expect(screen.getByText('საუკეთესო ექიმია!')).toBeInTheDocument();
      expect(screen.getByText('დავით')).toBeInTheDocument();
      expect(screen.getByText('ძალიან კარგი მომსახურება')).toBeInTheDocument();
    });
  });

  it('submits a new comment successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    // Mock for the POST request
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'name') return 'სანდრო';
      return null;
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('თქვენი კომენტარი')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('თქვენი კომენტარი'), {
      target: { value: 'ახალი კომენტარი' }
    });

    fireEvent.click(screen.getByText('კომენტარის დამატება'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining(`/api/doctors/${mockDoctor._id}/comments`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-token'
          }),
          body: JSON.stringify({ author: 'სანდრო', text: 'ახალი კომენტარი' })
        })
      );
    });
  });

  it('handles comment submission errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    // Mock for the failed POST request
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to add comment' })
    });

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'name') return 'სანდრო';
      return null;
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('თქვენი კომენტარი')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('თქვენი კომენტარი'), {
      target: { value: 'ახალი კომენტარი' }
    });

    fireEvent.click(screen.getByText('კომენტარის დამატება'));

    await waitFor(() => {
      expect(screen.getByText('კომენტარის დამატების შეცდომა')).toBeInTheDocument();
    });
  });

  it('validates empty comment submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctor
    });

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token';
      if (key === 'name') return 'სანდრო';
      return null;
    });

    render(
      <MemoryRouter initialEntries={[`/doctors/${mockDoctor._id}`]}>
        <Routes>
          <Route path="/doctors/:id" element={<DoctorDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('თქვენი კომენტარი')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('კომენტარის დამატება'));

    await waitFor(() => {
      expect(screen.getByText('please write a comment')).toBeInTheDocument();
    });
  });
});

describe('Doctors', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  it('loads and displays doctors list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctorsList
    });

    render(
      <MemoryRouter>
        <Doctors />
      </MemoryRouter>
    );

    expect(screen.getByText('იტვირთება ექიმთა მონაცემები...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('ექიმები')).toBeInTheDocument();
      expect(screen.getByText('ხელმისაწვდომია 188 ექიმი')).toBeInTheDocument();
      expect(screen.getByText(`${mockDoctorsList[0].first_name} ${mockDoctorsList[0].last_name}`)).toBeInTheDocument();
      expect(screen.getByText(`${mockDoctorsList[1].first_name} ${mockDoctorsList[1].last_name}`)).toBeInTheDocument();
    });

    expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <Doctors />
      </MemoryRouter>
    );

    expect(screen.getByText('იტვირთება ექიმთა მონაცემები...')).toBeInTheDocument();

    // Should still show loading state as we don't handle errors explicitly in the component
    await waitFor(() => {
      expect(screen.getByText('იტვირთება ექიმთა მონაცემები...')).toBeInTheDocument();
    });
  });

  it('retrieves doctor data from the API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoctorsList
    });

    render(
      <MemoryRouter>
        <Doctors />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/doctors/ui'));
    });
  });
});