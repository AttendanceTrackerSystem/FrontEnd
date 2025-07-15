import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {

  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "50px 15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="container bg-light p-5 rounded shadow"
        style={{ maxWidth: "900px", opacity: 0.95 }}
      >
        <h2 className="text-center text-primary mb-4">About BCD UNIVERSITY</h2>
        <p className="fs-5 text-justify">
          <strong>BCD UNIVERSITY</strong> is a center of excellence in education, research, and innovation. Our mission
          is to provide quality higher education that empowers students to become global leaders, professionals,
          and lifelong learners.
        </p>
        <p className="fs-5 text-justify">
          We offer a diverse range of programs across multiple disciplines, guided by expert faculty and supported by
          world-class infrastructure. BCD UNIVERSITY fosters an environment of critical thinking, creativity,
          and holistic development.
        </p>
        <p className="fs-5 text-justify">
          With a strong commitment to academic integrity, community engagement, and sustainability, we prepare our
          graduates to address real-world challenges and make meaningful contributions to society.
        </p>
        
      </div>
    </div>
  );
};

export default AboutUs;
