import Hero from "./Hero"
import Categories from "./Categories"
import Amenitiescard from "./Amenitiescard"

const Landing = () => {
    return (
    <div className="mb-48">
            <Hero />
            <Categories />
            <Amenitiescard />
        </div>
    )
}

export default Landing