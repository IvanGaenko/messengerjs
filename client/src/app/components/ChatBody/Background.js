const Background = () => {
  return (
    <div className="bg-[#0f0f0f] !absolute bottom-0 left-0 right-0 top-0 overflow-hidden">
      <div className="flex items-center justify-center bg-contain bg-repeat-x !bg-[#000] !bg-none !m-0 absolute bottom-0 left-0 right-0 top-0">
        <canvas
          width="50"
          height="50"
          data-colors="#fec496,#dd6cb9,#962fbf,#4f5bd5"
          className="h-full opacity-25 absolute w-full inline-block"
          style={{
            '--web-kit-maskPosition': 'center',
            '--web-kit-maskSize': 'cover',
            mixBlendMode: 'soft-light',
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Background;
