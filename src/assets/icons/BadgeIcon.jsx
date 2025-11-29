const BadgeIcon = ({ width = 32, height = 32, color = "#0868CC" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 0C11.6 0 8 3.6 8 8C8 12.4 11.6 16 16 16C20.4 16 24 12.4 24 8C24 3.6 20.4 0 16 0ZM12 19.24V32L16 28L20 32V19.24C18.76 19.68 17.4 20 16 20C14.6 20 13.24 19.68 12 19.24Z"
      fill={color}
    />
  </svg>
);

export default BadgeIcon;
