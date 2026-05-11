export default function Card({ children, className = '', ...rest }) {
  return (
    <div className={`card-base ${className}`} {...rest}>
      {children}
    </div>
  );
}
