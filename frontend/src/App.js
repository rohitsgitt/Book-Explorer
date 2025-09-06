import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">
              <i className="fas fa-book" style={{ marginRight: '0.5rem' }}></i>
              Book Explorer
            </a>

            <nav>
              <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="https://books.toscrape.com" target="_blank" rel="noopener noreferrer">Source</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{ 
        background: '#f8fafc', 
        borderTop: '1px solid #e5e7eb', 
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container text-center">
          <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
            Built with React, Node.js, Express, and MongoDB
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Data sourced from{' '}
            <a 
              href="https://books.toscrape.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none' }}
            >
              Books to Scrape
            </a>
            {' '}• © {new Date().getFullYear()} Book Explorer
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
