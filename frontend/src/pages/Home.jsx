import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "hover.css/css/hover-min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../assets/css/home.css";
import video from "../assets/videos/videoplayback.mp4";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const [activeSection, setActiveSection] = useState("training");
  // eslint-disable-next-line no-unused-vars
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
      duration: 800,
      once: true,
      mirror: false,
      easing: "ease-out-quart",
    });
  }, []);

  const features = [
    {
      icon: "bi-leaf",
      title: "Eco-Conscious",
      description:
        "Sustainable workouts designed with the planet in mind. No equipment waste.",
      color: "text-emerald-500",
    },
    {
      icon: "bi-person-heart",
      title: "Personalized",
      description:
        "AI adapts to your fitness level and goals with nature-inspired routines.",
      color: "text-teal-500",
    },
    {
      icon: "bi-globe",
      title: "Anywhere",
      description: "Outdoor-friendly workouts that connect you with nature.",
      color: "text-green-500",
    },
  ];

  const workouts = [
    {
      workoutImage:
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      workoutTitle: "Forest HIIT",
      workoutType: "Full body • Outdoor",
      duration: "30 min",
      intensity: "High",
      calories: "250-300 kcal",
    },
    {
      workoutImage:
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      workoutTitle: "Sunrise Yoga",
      workoutType: "Mind & Body • All levels",
      duration: "45 min",
      intensity: "Low",
      calories: "150-200 kcal",
    },
    {
      workoutImage:
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      workoutTitle: "Park Strength",
      workoutType: "Strength • Intermediate",
      duration: "25 min",
      intensity: "Medium",
      calories: "200-250 kcal",
    },
  ];

  return (
    <>
      <div className="min-vh-50 bg-gray-50 pt-56 ">
        {/* Hero Section */}
        <section className="hero-section d-flex align-items-center text-white position-relative overflow-hidden">
          <div className="container position-relative z-2 py-5">
            <div className="row align-items-center min-vh-75 py-5">
              <div
                className="col-lg-6 text-center text-lg-start"
                data-aos="fade-right"
              >
                <h1 className="display-3 fw-bold mb-4">
                  Train <span className="text-emerald-300">Smarter</span>.<br />
                  Go <span className="text-emerald-300">Greener</span>.
                </h1>
                <p className="lead mb-4 opacity-85">
                  Your personalized eco-conscious fitness journey begins here.
                  Join 50,000+ members reducing their carbon footprint while
                  getting fit.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-center">
                  {/* <button className="btn btn-light btn-lg rounded-pill px-4 py-3 fw-medium text-success shadow-sm hover-effect">
                    Get Started
                    <i className="bi bi-arrow-right ms-2 transition-all"></i>
                  </button> */}
                </div>
                <div className="d-flex align-items-center gap-4 mt-1 justify-content-center justify-content-lg-start">
                  <div className="d-flex">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="rounded-circle border border-2 border-white ms-n2"
                        style={{ width: "36px", height: "36px" }}
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/${
                            item % 2 === 0 ? "women" : "men"
                          }/${item + 10}.jpg`}
                          alt="User"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-0 small opacity-85">
                      Trusted by eco-athletes worldwide
                    </p>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-medium">4.9</span>
                      <span className="opacity-75 ms-1">(2.4k reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                  <video
                    className="img-fluid w-100 rounded-4"
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                  ></video>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>
        </section>

        {/* Stats Section */}
        <section className="py-4 bg-white">
          <div className="container">
            <div className="row g-4">
              {[
                { value: "50K+", label: "Active Members" },
                { value: "120+", label: "Green Workouts" },
                { value: "2.5K", label: "Trees Planted" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="col-6 col-md-3 text-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3 className="display-5 fw-bold text-success mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-5 bg-emerald-50">
          <div className="container py-5">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="badge bg-success bg-opacity-10 text-success mb-3">
                WHY CHOOSE US
              </span>
              <h2 className="display-5 fw-bold mb-3">
                Sustainable Fitness <br />
                <span className="text-success">Without Compromise</span>
              </h2>
              <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
                Our eco-conscious approach delivers results while respecting the
                planet
              </p>
            </div>

            <div className="row g-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="col-md-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="card h-100 border-0 shadow-sm hvr-float bg-white rounded-3 overflow-hidden transition-all feature-card">
                    <div className="card-body p-4 text-center">
                      <div
                        className={`bg-emerald-100 bg-opacity-50 rounded-3 p-3 d-inline-flex align-items-center justify-content-center mb-4 ${feature.color}`}
                      >
                        <i className={`bi ${feature.icon} fs-2`}></i>
                      </div>
                      <h3 className="h4 fw-bold mb-3">{feature.title}</h3>
                      <p className="text-muted mb-0">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workouts Preview Section */}
        <section id="workouts" className="py-5 bg-white">
          <div className="container py-5">
            <div className="row align-items-center mb-5">
              <div className="col-md-8" data-aos="fade-right">
                <span className="badge bg-success bg-opacity-10 text-success mb-2">
                  GREEN WORKOUTS
                </span>
                <h2 className="display-5 fw-bold mb-3">
                  Nature-Inspired <br />
                  <span className="text-success">Fitness Programs</span>
                </h2>
              </div>
              <div className="col-md-4 text-md-end" data-aos="fade-left">
                {/* <button className="btn btn-outline-success rounded-pill px-4">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </button> */}
              </div>
            </div>

            <div className="row g-4">
              {workouts.map((workout, index) => (
                <div
                  key={index}
                  className="col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="card border-0 shadow-sm h-100 overflow-hidden rounded-3 workout-card">
                    <div
                      className="position-relative overflow-hidden"
                      style={{ height: "220px" }}
                    >
                      <img
                        src={workout.workoutImage}
                        alt={workout.workoutTitle}
                        className="img-fluid w-100 h-100 object-fit-cover transition-all"
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        {/* <button
                          className="btn btn-sm btn-light rounded-circle shadow-sm"
                          style={{ width: "36px", height: "36px" }}
                        >
                          <i className="bi bi-bookmark"></i>
                        </button> */}
                      </div>
                      <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-50 text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-success">
                            {workout.duration}
                          </span>
                          <span className="small">{workout.intensity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="h5 fw-bold mb-2">
                        {workout.workoutTitle}
                      </h3>
                      <p className="text-muted small mb-3">
                        {workout.workoutType}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-success small fw-medium">
                          <i className="bi bi-fire me-1"></i>
                          {workout.calories}
                        </span>
                        {/* <button className="btn btn-sm btn-success rounded-pill px-3">
                          Start <i className="bi bi-arrow-right ms-1"></i>
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="testimonials" className="py-5 bg-emerald-50">
          <div className="container py-5">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="badge bg-success bg-opacity-10 text-success mb-3">
                TESTIMONIALS
              </span>
              <h2 className="display-5 fw-bold mb-3">
                What Our <span className="text-success">Community</span> Says
              </h2>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-10" data-aos="fade-up">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-md-5 position-relative">
                      <img
                        src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                        alt="Testimonial"
                        className="img-fluid h-100 object-fit-cover"
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-dark bg-opacity-50 text-white">
                        <h4 className="mb-1">Sarah Johnson</h4>
                        <p className="small opacity-75 mb-0">
                          Yoga Instructor & Environmentalist
                        </p>
                      </div>
                    </div>
                    <div className="col-md-7 bg-white">
                      <div className="card-body p-4 p-md-5">
                        <div className="text-warning mb-4">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="bi bi-star-fill fs-4 me-1"
                            ></i>
                          ))}
                        </div>
                        <blockquote className="blockquote mb-4">
                          <p className="lead fst-italic text-muted">
                            "GoGreenX has transformed not just my fitness
                            routine but my entire lifestyle. The outdoor
                            workouts connect me with nature in ways I never
                            imagined, and knowing each session has a minimal
                            environmental impact makes me feel good about my
                            choices."
                          </p>
                        </blockquote>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <img
                              src="https://randomuser.me/api/portraits/women/44.jpg"
                              alt="Sarah"
                              className="rounded-circle border shadow-sm"
                              width="60"
                              height="60"
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h5 className="mb-1">Sarah Johnson</h5>
                            <p className="text-muted small mb-0">
                              Member since 2022
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {/* <button className="btn btn-sm btn-outline-success rounded-pill">
                              <i className="bi bi-play-fill me-1"></i> Watch
                              Story
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-5 bg-success text-white">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center" data-aos="zoom-in">
                <h2 className="display-5 fw-bold mb-4">
                  Ready to Transform Your Fitness Journey?
                </h2>
                <p className="lead mb-5 opacity-85">
                  Join thousands of eco-conscious athletes making a difference
                  one workout at a time.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <button className="btn btn-light btn-lg rounded-pill px-4 py-3 fw-medium text-success shadow-sm">
                    Start 7-Day Free Trial
                  </button>
                  <button className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-medium">
                    Learn More
                  </button>
                </div>
                <p className="small mt-4 opacity-75">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
};

export default Home;
