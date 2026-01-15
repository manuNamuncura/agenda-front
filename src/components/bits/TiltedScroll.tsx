// src/components/ReactBits/TiltedScroll.tsx

interface TiltedScrollProps {
  items?: { id: string | number; text: string }[];
}

export default function TiltedScroll({ 
  items = []
}: TiltedScrollProps) {
  return (
    <div className="flex flex-col gap-4 py-8">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
          style={{ transform: "rotateX(20deg) rotateZ(-10deg)" }} // El efecto de inclinación
        >
          <span className="text-2xl font-bold italic text-white transition-all group-hover:scale-110">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}