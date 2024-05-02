import { teamInfo } from "./MemberInfo";
import ProfileCard from "./ProfileCard";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MemberCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    swipeToSlide: true,
  };
  return (
    <div id="carousel-container">
      <Slider {...settings}>
        {teamInfo.map((val, key) => (
          <ProfileCard key={`profile-${key}`} member={val} />
        ))}
      </Slider>
    </div>
  );
}

export default MemberCarousel;
