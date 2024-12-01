import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './projectsList.css';
import { Tilt } from 'react-tilt';
import { Helmet } from 'react-helmet';
import flowerSVG from '../images/SVG/8 flower.svg'
import projects from '../projects.json'; // Import the JSON data

// Function to import and sort images from a directory
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    // Extract the base filename without the extension
    const key = item.replace('./', '').split('.')[0];
    images[key] = r(item);
  });

  // Sort keys numerically
  const sortedKeys = Object.keys(images).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  // Return an object with sorted keys
  const sortedImages = {};
  sortedKeys.forEach((key) => {
    sortedImages[key] = images[key];
  });

  return sortedImages;
};

// Import images from the 'images' directory
const thumbnails = importAll(require.context('../images/projects/thumbnails', false, /\.(png|jpe?g|svg)$/));

const BottomNav = () => {
  return (
    <div className="bottom-bar">
      <Link to="/">POSTER</Link>
      <Link to="">BRANDING</Link>
      <Link to="">WEB</Link>
      <Link to="">MOBILE</Link>
      <Link to="">OTHER</Link>
    </div>
  )
}

export default function ProjectsList() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const projectsGridRef = useRef(null); // Ref for the container of the project cards

  useEffect(() => {
    const handleResize = () => {
      // Detect if the device is a touch device
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(touchDevice);
      // Add or remove the 'touch-device' class to the body
      document.body.classList.toggle('touch-device', touchDevice);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isTouchDevice) return;

    // Use Intersection Observer to detect when elements are fully visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('show-info');
            }, 100); // Delay to trigger a little after it's completely visible
          } else {
            entry.target.classList.remove('show-info');
          }
        });
      },
      { threshold: 1.0 }
    );

    // Get all project cards and observe them
    const projectCards = projectsGridRef.current.querySelectorAll('.project-card');
    projectCards.forEach((card) => observer.observe(card));

    return () => {
      projectCards.forEach((card) => observer.unobserve(card));
    };
  }, [isTouchDevice]);

  // Transform an array of categories into a string
  function categoriesToString(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return '';
    }
    return arr.join(' & ');
  }

  //Hover tilt animation
  const defaultOptions = {
    reverse: true,  // reverse the tilt direction
    max: 15,     // max tilt rotation (degrees)
    perspective: 2000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale: .98,    // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000,   // Speed of the enter/exit transition
    transition: true,   // Set a transition on enter/exit.
    axis: null,   // What axis should be disabled. Can be X or Y.
    reset: true,    // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
  }

  return (
    <>
      <div className="wrapper">
        <header className='header'>
          <h1 className='title'>Projects</h1>
          <p className='subtitle'>A portfolio of <span>thoughtfully</span> crafted designs with purpose and poise.</p>
        </header>
        <section className='grid-container'>
          <div className='projects-grid' ref={projectsGridRef}>
            {
              projects.map((item) => (
                <Tilt options={defaultOptions} key={item.id}>
                  <Link to={"/project/" + item.id} className='project-card'>
                    <img src={thumbnails[item.id]} alt={item.title} />
                    <div className='info'>
                      <h2 className='title'>{item.title}</h2>
                      <h4 className='category'>{categoriesToString(item.categories)}</h4>
                      <hr className='divider' />
                      <p className='description'>{item.description}</p>
                    </div>
                  </Link>
                </Tilt>
              ))
            }
          </div>
        </section>
      </div>
      <BottomNav />
    </>
  )
}