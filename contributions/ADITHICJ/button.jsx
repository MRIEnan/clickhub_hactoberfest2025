'use client';

export default function Button() {
  console.log("Aurora Button Loaded ✅");
  return (
    <>
      <button className="aurora-btn">
        <span className="aurora-btn-text">Aurora Pulse</span>
      </button>
      <style jsx>{`
        .aurora-btn {
          position: relative;
          padding: 14px 40px;
          border: none;
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 500;
          background: linear-gradient(
            120deg,
            #7b2ff7,
            #f107a3,
            #00e0ff,
            #2bff88,
            #7b2ff7
          );
          background-size: 400% 400%;
          border-radius: 14px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          animation: gradientShift 4s ease infinite;
          box-shadow: 0 0 18px rgba(123, 47, 247, 0.6);
          z-index: 1;
        }

        .aurora-btn-text {
          position: relative;
          z-index: 3;
          letter-spacing: 0.5px;
        }

        .aurora-btn::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 8%,
            rgba(255, 255, 255, 0.25) 18%,
            transparent 35%
          );
          background-size: 12% 12%;
          animation: auroraFlow 6s linear infinite;
          opacity: 0.55;
          filter: blur(20px);
          z-index: 0;
          pointer-events: none;
        }

        .aurora-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 0 35px rgba(123, 47, 247, 1);
        }

        @keyframes auroraFlow {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(30%, 30%) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  );
}
