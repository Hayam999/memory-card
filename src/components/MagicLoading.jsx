import { motion } from "framer-motion";

export default function MagicLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "black",
      }}
    >
      <motion.div
        initial={{ scale: 0.7, boxShadow: "0 0 0px #fff" }}
        animate={{
          scale: [0.7, 1.4, 1],
          boxShadow: [
            "0 0 60px #fff, 0 0 120px #b9f2ff, 0 0 180px #e5e4e2",
            "0 0 120px #fff, 0 0 240px #b9f2ff, 0 0 360px #e5e4e2",
            "0 0 60px #fff, 0 0 120px #b9f2ff, 0 0 180px #e5e4e2",
          ],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, #fff 60%, #b9f2ff 80%, #e5e4e2 100%)",
          marginBottom: 32,
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            color: "#fff",
            fontSize: 26,
            fontFamily: "cursive",
            letterSpacing: 2,
          }}
        >
          Loading
        </span>
        <motion.span
          style={{ display: "flex", marginLeft: 8 }}
          animate={{ gap: [2, 8, 2] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.2,
              }}
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "bold",
                margin: "0 2px",
                filter: "drop-shadow(0 0 4px #fff)",
              }}
            >
              .
            </motion.span>
          ))}
        </motion.span>
      </div>
    </div>
  );
}
