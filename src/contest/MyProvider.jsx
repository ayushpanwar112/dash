import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";


const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [data,setData] = useState([]);
const [path,setPath]=useState("");

  return (
    <MyContext.Provider value={{ data,setData,path,setPath }}>
      {children}
    </MyContext.Provider>
  );
};

MyProvider.propTypes = {
    children: PropTypes.node.isRequired, 
  };

export const useMyContext = () => useContext(MyContext);
