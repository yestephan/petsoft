export default function ContentBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F7F8FA] shadow-sm rounded overflow-hidden h-full w-full">
      {children}
    </div>
  );
}
