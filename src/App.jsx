
import { Dock,Navbar,Welcome} from "#components";

import {Image, Text,Finder, Resume,Safari, Terminal, Contact } from "#windows";

import gsap from "gsap";

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);



const App=() =>{

  return (
    <main>
      <Navbar/>
      <Welcome/>
      <Dock/>


      <Terminal/>
      <Safari/>
      <Resume/>
      <Finder/>
      <Text/>
      <Image/>
      <Contact/>

    </main>
  );
};

export default App
