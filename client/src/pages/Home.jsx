import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightedText from "../components/core/HomePage/HighlightedText";
import CTAButton from "../components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4"


const Home = () => {
  return (
    <div>
      {/* section1 */}
      <div className="relative max-w-max mx-auto flex flex-col w-11/12 items-center text-white justify-between">
         <Link to={"/signup"}>
            <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95">
                <div className="flex flex-row items-center gap-4 border-s-violet-200 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                    <p>become an instructor</p>
                    <FaArrowRight></FaArrowRight>
                </div>
            </div>
        </Link>

        <div className="text-white text-3xl mt-[12px]">
          Empower your thinking with <HighlightedText text={"chess Skills"}/>
        </div>


        <div className="w-[60%] mt-16 text-center text-lg font-bold text-richblack-300">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore recusandae dolor veniam rerum iusto perspiciatis ullam eum illum delectus, tempore quaerat vero veritatis debitis inventore. Doloremque, itaque dolorum. Sapiente maxime, suscipit sed omnis ex ut iste quia error temporibus provident dolore! Voluptate, officiis incidunt cumque magni sit tempore natus ut.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/singup"}>Learn more</CTAButton>
          <CTAButton active={false} linkto={"/login"}>Book a demo</CTAButton>
        </div>


        <div className="mx-3 my-13 shadow-blue-200 w-[1080px] h-[600px]">
          <video>
          <source muted loop autoPlay src={Banner} className="rounded-md mt-14" type="video/mp4"></source>
          </video>
        </div>

      </div>
        


      {/* section2 */}

      {/* sectio3*/}

      {/* section4 */}
    </div>
  )
}

export default Home

