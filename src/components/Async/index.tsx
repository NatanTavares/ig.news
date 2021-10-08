import { useEffect, useState } from "react";

export function Async() {
  const [isParaphVisible, setIsParaphVisible] = useState(false);
  const [isButtonInvisible, setIsButtonInvisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsParaphVisible(true);
      setIsButtonInvisible(false);
    }, 1000);
  }, []);

  return (
    <div>
      <div>Hello World!</div>
      {isParaphVisible && <p>Paraph</p>}

      {isButtonInvisible && <button>Button</button>}
    </div>
  );
}
