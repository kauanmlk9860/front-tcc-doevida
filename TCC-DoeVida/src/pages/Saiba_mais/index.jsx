import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'

function Saiba_mais() {
//   const navigate = useNavigate()

  useEffect(() => {}, [])

  return (
    <div className="saiba">
      <header className="saiba__header">
        <img className="saiba__logo" src={Logo_Branca} alt="DOEVIDA" />

        <div className="saiba__actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/cadastro')}>Sou Doador</button>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/hospital')}>Sou Hospital</button>
        </div>
      </header>

      <main className="saiba__main">
        <section className="hero">
          <h1 className="hero__title">Saiba Mais</h1>

          <img
            className="hero__image"
            src=""
            alt="Ilustração sobre doação de sangue"
          />

          <p className="hero__text">
            O projeto DOEVIDA nasceu da vontade de transformar solidariedade em impacto real.
            Percebemos que muitas pessoas têm o desejo de doar sangue, mas nem sempre sabem como,
            quando ou onde. Foi assim que criamos essa iniciativa para aproximar doadores e
            hemocentros, tornando o processo mais acessível, humano e eficiente.
          </p>
        </section>

        <div className="decor decor--bubbles" aria-hidden="true" />
      </main>
    </div>
  )
}

export default Saiba_mais
