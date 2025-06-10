import "./index.css"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import ScrollToTop from "./ScrollToTop"
import { AuthProvider } from "../context/AuthContext"

function App({children}) {  // children is a prop, which represents any component placed between footer and header
  return (
    <>
      <AuthProvider>
        <ScrollToTop/>
        <div className="flex flex-col min-h-screen">
          <Header/>
          <main className="w-full bg-[#f7f9fc] pt-10 mt-6 flex-grow">
            {children}
          </main>
          <Footer/>
        </div>
      </AuthProvider>
    </>
  )
}

export default App

