import { useRef, useState } from 'react';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ classname = "", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type={showPassword ? "text" : "password"}
        className={classname}
        {...props}
      />
      {(inputRef?.current && inputRef.current?.value) ? 
        <button
          type="button"
          className="absolute inset-y-0 right-[14px] flex items-center justify-center pt-[1px]"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {(showPassword ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />)}
        </button>
      : null}
    </div>
  );
}