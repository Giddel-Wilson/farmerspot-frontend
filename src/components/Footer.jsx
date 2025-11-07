function Footer() {
  return (
    <footer className="text-gray-600 border-t border-gray-200 body-font bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto py-12 px-8">
        <div className="flex flex-col md:flex-row items-center justify-end gap-6">
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-600 text-sm font-medium">
              © {new Date().getFullYear()} Farmerspot
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Supporting local farmers, empowering communities
            </p>
          </div>

          <div
            onClick={() => {
              const url = 'https://github.com/amannegi/farmerspot';
              window.open(url, '_blank');
            }}
            className="group flex flex-row items-center justify-center w-auto hover:scale-105 transition-all duration-300 cursor-pointer"
          >
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
