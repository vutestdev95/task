import clsx from "clsx";
const clsDefault = "cursor-pointer hover:bg-[#ecf0ff] rounded-[6px]";

export const SVGCloseModalIcon = ({
  onClick,
  className,
  ...rest
}: React.ComponentProps<"svg">) => {
  return (
    <svg
      className={clsx(clsDefault, className)}
      onClick={onClick}
      {...rest}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.071 8.92912C23.4615 9.31965 23.4615 9.95281 23.071 10.3433L17.4135 15.9995L23.071 21.657C23.4615 22.0476 23.4615 22.6807 23.071 23.0713C22.6805 23.4618 22.0473 23.4618 21.6568 23.0713L15.9992 17.4137L10.3431 23.0713C9.95257 23.4618 9.3194 23.4618 8.92888 23.0713C8.53836 22.6807 8.53836 22.0476 8.92888 21.657L14.5857 15.9988L8.92888 10.3433C8.53836 9.95281 8.53836 9.31965 8.92888 8.92912C9.3194 8.5386 9.95257 8.5386 10.3431 8.92912L15.9999 14.5846L21.6568 8.92912C22.0473 8.5386 22.6805 8.5386 23.071 8.92912Z"
        fill="#102A47"
      />
    </svg>
  );
};
