import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "hover.css/css/hover-min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/css/home.css";

const Home = () => {
  const [activeSection, setActiveSection] = useState("training");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const features = [
    {
      icon: "bi-leaf",
      title: "Eco-Conscious",
      description:
        "Sustainable workouts designed with the planet in mind. No equipment waste.",
    },
    {
      icon: "bi-person-heart",
      title: "Personalized",
      description:
        "AI adapts to your fitness level and goals with nature-inspired routines.",
    },
    {
      icon: "bi-globe",
      title: "Anywhere",
      description: "Outdoor-friendly workouts that connect you with nature.",
    },
  ];

  const workouts = [
    {
      workoutImage:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      workoutTitle: "Forest HIIT",
      workoutType: "Full body • Outdoor",
      duration: "30 min",
    },
    {
      workoutImage:
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      workoutTitle: "Sunrise Yoga",
      workoutType: "Mind & Body • All levels",
      duration: "45 min",
    },
    {
      workoutImage:
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      workoutTitle: "Park Strength",
      workoutType: "Strength • Intermediate",
      duration: "25 min",
    },
  ];

  return (
    <div className="bg-white min-vh-100">
      {/* Hero Section */}
      <section className="pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-6 mb-5 mb-lg-0"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
                Eco-friendly fitness.
                <br />
                <span className="text-success animate__animated animate__fadeInUp animate__delay-2s">
                  Maximum results.
                </span>
              </h1>
              <p className="lead text-muted mb-4 animate__animated animate__fadeIn animate__delay-2s">
                Sustainable workouts with over 350 bodyweight exercises that
                adapt to you and the planet.
              </p>
              <div className="d-flex flex-wrap gap-3 animate__animated animate__fadeInUp animate__delay-3s">
                <button className="btn btn-success btn-lg rounded-pill px-4 py-3 fw-medium btn-animated pulse-button shadow-lg">
                  Start Training Now{" "}
                  <i className="bi bi-arrow-right ms-2 animate__animated animate__slideOutRight animate__infinite"></i>
                </button>
                <button className="btn btn-outline-success btn-lg rounded-pill px-4 py-3 fw-medium btn-animated hvr-sweep-to-right">
                  See All Features
                  <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3"
                  alt="Person doing fitness training"
                  className="img-fluid rounded-3 shadow-lg image-hover animate__animated animate__zoomIn"
                  style={{
                    filter: "brightness(1.05) contrast(1.05)",
                    transition: "transform 0.5s ease, filter 0.5s ease",
                  }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-success opacity-10 rounded-3"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(40, 167, 69, 0.2), transparent)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-5" data-aos="fade-up">
            Why choose <span className="text-success">GoGreenX</span>?
          </h2>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="col-md-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="card h-100 border-0 shadow-sm hvr-float hvr-shadow transition-all">
                  <div className="card-body p-4 text-center">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto hvr-buzz"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className={`bi ${feature.icon} fs-3 text-success`}></i>
                    </div>
                    <h3 className="h4 fw-bold mb-3">{feature.title}</h3>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workouts Preview Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5 animate__animated animate__fadeIn">
            Green Workouts
          </h2>

          <div className="row g-4">
            {workouts.map((workout, index) => (
              <div
                key={index}
                className="col-md-6 col-lg-4 animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Workout Card Template */}
                <div className="card border-0 shadow-sm h-100 overflow-hidden hvr-float hvr-shadow">
                  <div
                    className="position-relative overflow-hidden"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={workout.workoutImage}
                      alt={workout.workoutTitle}
                      className="img-fluid w-100 h-100 object-fit-cover image-hover"
                      style={{
                        transform: "scale(1.01)",
                        transition: "all 0.5s ease",
                      }}
                    />
                    <div className="position-absolute bottom-0 start-0 bg-success text-white px-3 py-1 animate__animated animate__fadeInUp">
                      {workout.duration}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="h5 fw-bold mb-2">{workout.workoutTitle}</h3>
                    <p className="text-muted small mb-3">
                      {workout.workoutType}
                    </p>
                    <button className="btn btn-link text-success p-0 fw-medium d-flex align-items-center btn-animated">
                      Start Workout
                      <i className="bi bi-arrow-right ms-2 animate__animated animate__slideOutRight animate__infinite"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 animate__animated animate__fadeIn">
            <button className="btn btn-outline-success btn-lg rounded-pill px-4 py-3 fw-medium hvr-sweep-to-right btn-animated">
              View All Green Workouts
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="display-5 fw-bold text-center mb-5 animate__animated animate__fadeIn">
            What Our Community Says
          </h2>

          <div className="row justify-content-center">
            <div className="col-lg-8 animate__animated animate__fadeInUp">
              <div className="card border-0 shadow-sm p-4 p-md-5 hvr-glow">
                <div className="text-warning text-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className="bi bi-star-fill fs-4 mx-1 hvr-buzz"
                    ></i>
                  ))}
                </div>

                <p className="lead fst-italic text-center text-muted mb-4">
                  "GoGreenX changed my approach to fitness. Not only do I feel
                  healthier, but I love that my workouts now have minimal
                  environmental impact. The outdoor routines make me appreciate
                  nature more!"
                </p>

                <div className="text-center">
                  <p className="fw-bold mb-1">Jamie R.</p>
                  <p className="text-muted small">GoGreenX member for 1 year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-5 bg-success text-white position-relative overflow-hidden"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3")',
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-success opacity-75"></div>
        <div className="container position-relative">
          <div
            className="row justify-content-center text-center"
            data-aos="zoom-in"
          >
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4 animate__animated animate__fadeIn">
                Ready to join the green fitness revolution?
              </h2>
              <p className="lead mb-5 opacity-90 animate__animated animate__fadeIn animate__delay-1s">
                Become part of our eco-conscious community transforming fitness
                sustainably.
              </p>
              <button className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-medium text-success btn-animated pulse-button animate__animated animate__fadeInUp animate__delay-2s">
                Start Your Green Journey
                <i className="bi bi-arrow-right-circle-fill ms-2 animate__animated animate__bounceIn animate__delay-3s"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
