function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;