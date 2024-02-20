import Input from "./input";

export default function LabeledInput({
  className,
  subtitle,
  children,
  ...props
}) {
  return (
    <div className="mt-2 mb-8">
      <label
        className={`${
          props.disabled == true ? "text-zinc-600" : "text-tock-blue"
        } block text-sm font-bold mb-2 ${className}`}
      >
        {children}
      </label>
      <Input {...props} />
      {subtitle && <div className="text-zinc-400 text-xs mt-2">{subtitle}</div>}
    </div>
  );
}
