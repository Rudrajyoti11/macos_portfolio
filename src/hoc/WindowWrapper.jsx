// hoc/WindowWrapper.js

import useWindowStore from "#store/window.js";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";


const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const windowState = windows[windowKey] || {};
    const { isOpen = false, zIndex = 0 } = windowState;

    const ref = useRef(null);
    const draggableRef = useRef(null);

    // Animate when window opens
    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;


      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
      );
    }, [isOpen]);

    // Setup Draggable and cleanup on unmount
    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      draggableRef.current = Draggable.create(el, {
        onPress: () => focusWindow(windowKey)
      });

      return () => {
        if (draggableRef.current)
          draggableRef.current.forEach((d) => d.kill());
      };
    }, []);

    // Toggle display on open/close
    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    return (
      <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
};

export default WindowWrapper;
