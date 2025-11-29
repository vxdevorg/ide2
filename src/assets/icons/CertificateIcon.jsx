const CertificateIcon = ({ width = 22, height = 18, color = "#0868CC" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 2C0 0.89543 0.895431 0 2 0H20C21.1046 0 22 0.895431 22 2V16C22 17.1046 21.1046 18 20 18H2C0.89543 18 0 17.1046 0 16V2ZM4 8V10H10V8H4ZM4 12V14H18V12H4ZM15.502 5.688L18 7.75V2H13.004V7.75L15.502 5.688Z"
      fill={color}
    />
  </svg>
);

export default CertificateIcon;
