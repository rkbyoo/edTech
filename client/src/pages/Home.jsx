import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightedText from "../components/core/HomePage/HighlightedText";

const Home = () => {
  return (
    <div>
      {/* section1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
         <Link to={"/signup"}>
            <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95">
                <div className="flex flex-row items-center gap-4 mt-10 border-s-violet-200 rounded-sm">
                    <p>become an instructor</p>
                    <FaArrowRight></FaArrowRight>
                </div>
            </div>
        </Link>

        <div className="text-white text-3xl mt-[10px]">
          Empower your thinking with <HighlightedText text={"chess Skills"}/>
        </div>
      </div>
        


      {/* section2 */}

      {/* sectio3*/}

      {/* section4 */}
    </div>
  )
}

export default Home

