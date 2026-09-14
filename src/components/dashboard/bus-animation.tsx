'use client'

export function BusAnimation() {
  return (
    <div
      className="relative w-full select-none pointer-events-none"
      style={{ height: 80 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes busRide {
          from { left: -95px; }
          to   { left: calc(100% + 95px); }
        }
        @keyframes lipuPulse {
          0%   { opacity: 0.85; transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(1.7); }
        }
      `}</style>

      {/* Road */}
      <div
        className="absolute inset-x-0 bg-gray-200 dark:bg-night-801"
        style={{ top: 60, height: 1 }}
      />
      {/* Brand dashes */}
      <div
        className="absolute inset-x-0"
        style={{
          top: 50,
          height: 1,
          background:
            'repeating-linear-gradient(to right, transparent 0, transparent 18px, rgba(208,223,0,0.45) 18px, rgba(208,223,0,0.45) 34px)',
        }}
      />

      {/* Bus — wrapper is 80×48 (visual size after 90° rotation of the 48×80 SVG) */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: -95,
          width: 80,
          height: 48,
          animation: 'busRide 20s linear infinite',
        }}
      >
        {/* Halo — lipu-unit-focus-pulse */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 46,
            height: 46,
            borderRadius: '50%',
            border: '2px solid #3b82f6',
            animation: 'lipuPulse 1800ms ease-out infinite',
          }}
        />
        {/*
          Original SVG: 41×69 portrait (bus facing "up").
          Displayed at 48×80, then rotated 90° CW so the bus faces right → travels left→right.
          Visual footprint after rotation: 80px wide, 48px tall.
        */}
        <svg
          width="48"
          height="80"
          viewBox="0 0 41 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
          }}
        >
          <g clipPath="url(#clip0)">
            <g filter="url(#f0)">
              <g filter="url(#f1)">
                <path d="M14.5117 15.41L14.6648 11.9184L14.935 9.88352C15.0074 9.44954 15.1919 9.04199 15.4701 8.70118C15.7484 8.36038 16.1108 8.09813 16.5216 7.94038C17.975 7.3368 20.7279 7.37597 20.7279 7.37597C22.1385 7.3588 23.5426 7.56968 24.886 8.00044C25.3915 8.16803 25.828 8.49724 26.128 8.93734C26.428 9.37743 26.575 9.90399 26.5462 10.4358L26.7712 13.418L26.846 15.4188L26.8455 16.4569L26.6349 17.0604L26.6528 19.2497L26.8413 19.4195C26.9687 19.8891 26.9684 20.3842 26.8406 20.8537L26.652 20.8535L26.6293 28.7048L26.588 35.9532L26.8323 36.7463L26.8109 41.9554L26.6409 42.7264L26.6008 47.4638C26.6008 47.4638 26.5634 47.9924 25.7704 48.2191C24.9775 48.4459 15.9752 48.2144 15.9752 48.2144C15.6847 48.2255 15.3979 48.1459 15.1546 47.9868C14.9113 47.8277 14.7235 47.5969 14.6171 47.3263L14.6192 42.91L14.3931 42.2088L14.3958 36.5524L14.6604 35.9861L14.5351 20.8302L14.4026 20.6977C14.3187 20.2739 14.3189 19.8378 14.4033 19.4141L14.6137 19.204L14.6149 16.6368L14.4453 16.4104L14.5117 15.41Z" fill="#D0DF00"/>
              </g>
            </g>
            <path opacity="0.3" d="M15.8711 9.12876L15.4951 13.2299C15.4951 13.2299 20.7889 11.0896 25.8077 13.2299L25.3833 9.12876C25.3833 9.12876 24.0272 8.47492 24.1906 8.01752C21.893 7.56187 19.5283 7.56187 17.2307 8.01752C17.2307 8.01752 17.4398 8.45879 15.8711 9.12876Z" fill="#D0DF00"/>
            <path d="M14.9893 9.91562C14.9893 9.91562 15.157 8.65707 17.2209 8.02148C17.2209 8.02148 17.7751 8.15547 16.1048 9.06185C15.6765 9.26393 15.2962 9.55499 14.9893 9.91562Z" fill="url(#p0)"/>
            <path d="M26.3871 9.94441C26.3871 9.94441 26.2159 8.65008 24.1 7.99414C24.1 7.99414 23.5325 8.13445 25.2436 9.06398C25.6821 9.27418 26.0717 9.57412 26.3871 9.94441Z" fill="url(#p1)"/>
            <path d="M15.4961 13.2301C17.1171 12.5004 18.8746 12.123 20.6524 12.123C22.4301 12.123 24.1876 12.5004 25.8086 13.2301V13.5731C25.8086 13.5731 21.4626 10.7797 15.4961 13.5731V13.2301Z" fill="#D0DF00"/>
            <path d="M14.9395 9.90577C15.0183 9.47391 15.2051 9.06902 15.4826 8.72886C15.7601 8.3887 16.1192 8.12433 16.5264 7.96041C19.2595 7.14792 22.1726 7.16771 24.8943 8.01724C25.3147 8.14892 25.69 8.39556 25.9776 8.72929C26.2652 9.06301 26.4537 9.47052 26.5219 9.90577L26.3858 9.94435C26.3858 9.94435 26.242 8.57916 24.1886 8.01864C21.8932 7.54037 19.524 7.54037 17.2287 8.01864C16.7219 8.12219 16.2483 8.34836 15.8493 8.67734C15.4502 9.00633 15.1378 9.42811 14.9395 9.90577Z" fill="#D0DF00"/>
            <path opacity="0.88" d="M15.4629 13.426L15.9364 17.5756C19.0124 16.7423 22.2547 16.7423 25.3307 17.5756L25.8218 13.426C24.189 12.7097 22.4253 12.3398 20.6423 12.3398C18.8593 12.3398 17.0957 12.7097 15.4629 13.426Z" fill="url(#p2)"/>
            <path d="M13.2343 16.4224L13.127 16.3241C13.127 16.3241 13.1172 15.5721 15.0029 15.4121V15.7447L14.5336 15.7741L14.3575 16.1551L13.2343 16.4224Z" fill="#393939"/>
            <path d="M28.0521 16.4223L28.1538 16.3241C28.1538 16.3241 28.1629 15.5721 26.3789 15.4121V15.7446L26.823 15.7741L26.9892 16.155L28.0521 16.4223Z" fill="#393939"/>
            <path opacity="0.88" d="M14.8154 23.1012L15.183 22.7168H15.4503L15.4335 45.772C15.4335 45.772 15.4826 45.9221 14.8154 46.1059V23.1012Z" fill="url(#p3)"/>
            <path opacity="0.88" d="M26.485 23.1012L26.1027 22.7168H25.8262L25.8438 45.772C25.8438 45.772 25.7919 45.9221 26.485 46.1059V23.1012Z" fill="url(#p4)"/>
            <path d="M26.6689 19.2734L26.8576 19.4432C26.9753 19.9144 26.9753 20.4073 26.8576 20.8785H26.6689V19.2734Z" fill="#C1C1C1"/>
            <path d="M26.8053 19.9278V20.4708H26.665V19.8008L26.7352 19.8815L26.8053 19.9278Z" fill="#6D6262"/>
            <path d="M14.5999 19.2344L14.3894 19.4041C14.2582 19.8736 14.2582 20.37 14.3894 20.8395H14.5999V19.2344Z" fill="#C1C1C1"/>
            <path d="M14.4473 19.8868V20.4298H14.6002V19.7598L14.5238 19.8405L14.4473 19.8868Z" fill="#6D6262"/>
            <g opacity="0.53">
              <path opacity="0.53" d="M17.3186 22.4512H16.9805V45.4174H17.3186V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M18.0539 22.4512H17.7158V45.4174H18.0539V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M23.4826 22.4512H23.1445V45.4174H23.4826V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M24.218 22.4512H23.8799V45.4174H24.218V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M18.7707 22.4512H18.4326V28.1133H18.7707V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M19.5842 22.4512H19.2461V28.1133H19.5842V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M20.3059 22.4512H19.9678V28.1133H20.3059V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M21.1193 22.4512H20.7812V28.1133H21.1193V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M21.9524 22.4512H21.6143V28.1133H21.9524V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M22.7659 22.4512H22.4277V28.1133H22.7659V22.4512Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M18.7707 38.2051H18.4326V45.4175H18.7707V38.2051Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M19.5842 38.2051H19.2461V45.4175H19.5842V38.2051Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M20.3059 38.2051H19.9678V45.4176H20.3059V38.2051Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M21.1194 38.2051H20.7812V45.4176H21.1194V38.2051Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M21.9525 38.2051H21.6143V45.4176H21.9525V38.2051Z" fill="#DDDDDD"/>
              <path opacity="0.53" d="M22.7658 38.2051H22.4277V45.4176H22.7658V38.2051Z" fill="#DDDDDD"/>
            </g>
            <g opacity="0.53">
              <path opacity="0.53" d="M22.8224 29.041H18.6426V37.3044H22.8224V29.041Z" fill="#ECEDE9"/>
              <path opacity="0.53" d="M22.8225 29.2617H18.8398V37.3048H22.8225V29.2617Z" fill="#E1E1DF"/>
              <path opacity="0.53" d="M22.8226 29.041H22.6367V37.3043H22.8226V29.041Z" fill="#BDBDBA"/>
              <path opacity="0.53" d="M22.636 37.1191H18.7656V37.305H22.636V37.1191Z" fill="#BDBDBA"/>
            </g>
            <path opacity="0.53" d="M20.8311 30.0352C20.5661 30.0352 20.307 30.1138 20.0867 30.261C19.8663 30.4082 19.6946 30.6175 19.5932 30.8623C19.4918 31.1072 19.4652 31.3766 19.5169 31.6365C19.5686 31.8964 19.6963 32.1352 19.8836 32.3226C20.071 32.51 20.3098 32.6376 20.5697 32.6893C20.8296 32.741 21.099 32.7145 21.3439 32.6131C21.5887 32.5116 21.798 32.3399 21.9452 32.1195C22.0925 31.8992 22.171 31.6401 22.171 31.3751C22.171 31.0197 22.0299 30.6789 21.7786 30.4276C21.5273 30.1764 21.1865 30.0352 20.8311 30.0352ZM20.8311 31.9616C20.696 31.9613 20.5651 31.9141 20.4608 31.8282C20.3565 31.7422 20.2853 31.6228 20.2591 31.4902C20.233 31.3576 20.2536 31.2201 20.3175 31.101C20.3814 30.9819 20.4846 30.8886 20.6095 30.8371C20.7344 30.7855 20.8733 30.7788 21.0026 30.8182C21.1319 30.8575 21.2435 30.9404 21.3186 31.0528C21.3936 31.1652 21.4273 31.3002 21.414 31.4346C21.4008 31.5691 21.3413 31.6949 21.2457 31.7904C21.1912 31.8448 21.1266 31.8879 21.0555 31.9173C20.9843 31.9466 20.9081 31.9617 20.8311 31.9616Z" fill="#D0DF00"/>
            <path opacity="0.53" d="M20.8311 33.7695C20.566 33.7695 20.307 33.8481 20.0866 33.9954C19.8662 34.1426 19.6945 34.3519 19.5931 34.5968C19.4917 34.8417 19.4652 35.1111 19.517 35.371C19.5687 35.631 19.6964 35.8698 19.8839 36.0572C20.0713 36.2445 20.3101 36.3721 20.5701 36.4237C20.8301 36.4753 21.0995 36.4486 21.3444 36.3471C21.5892 36.2456 21.7984 36.0738 21.9455 35.8533C22.0927 35.6329 22.1712 35.3738 22.171 35.1087C22.1708 34.7535 22.0296 34.4128 21.7783 34.1617C21.5271 33.9105 21.1863 33.7695 20.8311 33.7695ZM20.8311 35.6959C20.696 35.6955 20.5652 35.6484 20.4609 35.5625C20.3566 35.4766 20.2853 35.3573 20.2592 35.2248C20.233 35.0922 20.2535 34.9547 20.3173 34.8356C20.3811 34.7165 20.4842 34.6232 20.609 34.5715C20.7338 34.5199 20.8727 34.5131 21.002 34.5523C21.1313 34.5915 21.243 34.6742 21.3181 34.7865C21.3933 34.8988 21.4272 35.0336 21.4141 35.1681C21.401 35.3025 21.3418 35.4283 21.2464 35.524C21.1919 35.5786 21.1272 35.6218 21.0559 35.6513C20.9846 35.6808 20.9082 35.696 20.8311 35.6959Z" fill="#D0DF00"/>
            <path opacity="0.88" d="M26.3537 14.3164V20.5075L26.0288 20.8421C26.0288 20.8421 25.8085 20.9123 25.7629 20.7404C25.7173 20.5685 25.8815 17.5835 25.8815 17.5835C25.9508 16.4835 26.1087 15.391 26.3537 14.3164Z" fill="url(#p5)"/>
            <path opacity="0.88" d="M14.9639 14.3164V20.5075L15.2824 20.8421C15.2824 20.8421 15.5006 20.9123 15.544 20.7404C15.5875 20.5685 15.4276 17.5835 15.4276 17.5835C15.3598 16.4839 15.2047 15.3914 14.9639 14.3164Z" fill="url(#p6)"/>
            <path opacity="0.88" d="M16.131 47.9554L16.4341 47.6903C16.4399 47.6853 16.4465 47.6815 16.4538 47.679C16.461 47.6766 16.4686 47.6757 16.4762 47.6762C19.2807 47.8806 22.0964 47.8806 24.9009 47.6762C24.9099 47.6751 24.9191 47.6761 24.9276 47.6791C24.9361 47.6822 24.9438 47.6872 24.95 47.6938L25.2005 47.9568C25.2081 47.9648 25.2133 47.9747 25.2154 47.9855C25.2176 47.9962 25.2167 48.0074 25.2128 48.0177C25.2089 48.0279 25.2022 48.0369 25.1935 48.0435C25.1847 48.0501 25.1743 48.0541 25.1633 48.0551C22.1687 48.2976 19.1594 48.2976 16.1647 48.0551C16.1534 48.0541 16.1427 48.0499 16.1338 48.0429C16.1248 48.0359 16.1181 48.0265 16.1145 48.0158C16.1108 48.005 16.1104 47.9935 16.1132 47.9825C16.116 47.9716 16.122 47.9617 16.1304 47.954L16.131 47.9554Z" fill="url(#p7)"/>
            <path d="M16.9561 47.1278L17.0305 47.0156H17.5012L17.5531 47.1278V47.212H16.9561V47.1278Z" fill="url(#p8)"/>
          </g>
          <defs>
            <filter id="f0" x="1.3496" y="1.37951" width="38.5772" height="66.9238" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity={0} result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="6.99475"/>
              <feGaussianBlur stdDeviation="6.49512"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.275 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <filter id="f1" x="10.3398" y="7.375" width="20.5967" height="48.9434" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity={0} result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow2"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow2" result="shape"/>
            </filter>
            <linearGradient id="p0" x1="17.3091" y1="8.96665" x2="14.9893" y2="8.96665" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p1" x1="24.0098" y1="8.96927" x2="26.3871" y2="8.96927" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p2" x1="20.6423" y1="17.5756" x2="20.6423" y2="12.3398" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.9999" stopOpacity="0.5"/><stop offset="1" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="p3" x1="15.4503" y1="34.4114" x2="14.8154" y2="34.4114" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.4"/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p4" x1="8.17473" y1="34.4114" x2="7.53969" y2="34.4114" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.4"/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p5" x1="25.7549" y1="17.5863" x2="26.3537" y2="17.5863" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.4"/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p6" x1="14.9639" y1="17.5863" x2="15.5527" y2="17.5863" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.4"/><stop offset="1"/>
            </linearGradient>
            <linearGradient id="p7" x1="16.1114" y1="48.2381" x2="16.1802" y2="47.1199" gradientUnits="userSpaceOnUse">
              <stop/><stop offset="0.4"/><stop offset="1"/>
            </linearGradient>
            <radialGradient id="p8" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-818.644 -4483.01) scale(0.221578 0.224346)">
              <stop/><stop offset="0.14"/><stop offset="0.38"/><stop offset="0.67"/><stop offset="1"/>
            </radialGradient>
            <clipPath id="clip0">
              <rect width="40" height="68" fill="white" transform="translate(0.617188 0.845703)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}
