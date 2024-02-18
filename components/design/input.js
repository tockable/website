export default function Input({ className, ...props }) {
  return (
    <input
      className={`disabled:bg-zinc-800 text-sm appearance-none bg-zinc-700 rounded-xl w-full py-3 px-2 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500 ${
        props.className && props.className
      }`}
      {...props}
    />
  );
}
