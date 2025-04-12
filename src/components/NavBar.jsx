import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';
import { MdBusiness, MdMovie, MdPublic, MdFavorite, MdScience, MdSportsSoccer, MdComputer } from 'react-icons/md';

const categoryIcons = {
  business: <MdBusiness />,
  entertainment: <MdMovie />,
  general: <MdPublic />,
  health: <MdFavorite />,
  science: <MdScience />,
  sports: <MdSportsSoccer />,
  technology: <MdComputer />
};

const CustomNavbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.body.className = darkMode ? 'bg-light text-dark' : 'bg-dark text-light';
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <Navbar expand="lg" bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} sticky="top" className="shadow">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          📰 Vistara News
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {Object.keys(categoryIcons).map((cat) => (
              <Nav.Link
                key={cat}
                as={Link}
                to={`/news/${cat}`}
                className={`d-flex align-items-center gap-1 ${location.pathname === `/news/${cat}` ? 'fw-bold text-primary' : ''}`}
              >
                {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Nav.Link>
            ))}
          </Nav>

          <Nav className="d-flex align-items-center gap-2">
            <Button
              variant={darkMode ? "outline-light" : "outline-dark"}
              onClick={handleThemeToggle}
              title="Toggle Theme"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
            
            <Button
  variant={darkMode ? "outline-light" : "outline-dark"}
  onClick={handleProfileClick}
  title="Profile"
>
  <FaUserCircle />
</Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
