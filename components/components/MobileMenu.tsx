interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
  }
  
  export default function MobileMenu({ isOpen, setIsOpen }: Props) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        ☰
      </button>
    );
  }
  