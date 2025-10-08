const Layout = ({ children }) => {
    return (<div className="App">
      <header>
        <div className="title-box">
          <h1 className="title-text">Harmony</h1>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2025 Harmony</p>
        </div>
      </footer>
    </div>)
}

export default Layout;