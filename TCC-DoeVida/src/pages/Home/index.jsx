import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'
import pessoas from '../../assets/pessoas.png'
import Api from '../../services/api'

function Home(){
  return(
       <header className="header">
            <div className="logo-container">
              <div className="logo-icon">
                <img
                  src={logoBranca}
                  alt="Logo DoeVida"
                  className="logo-img"
                />
              </div>
              <h1 className="logo-text">DOEVIDA</h1>
            </div>
    
            <nav className="nav-buttons">
              <button className="btn-donor">Sou Doador</button>
              <button className="btn-hospital">Sou Hospital</button>
            </nav>
          </header>
  )
}

export default Home