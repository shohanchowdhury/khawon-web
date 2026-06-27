import SearchBar from '../components/SearchBar'
import NavBar from '../components/NavBar'

export default function Home() {
  return (
    <div className="hero-page">
      <NavBar />

      <section className="hero">
        <p className="hero__eyebrow">Bangladesh food finder</p>
        <h1 className="hero__title">Find the best places to eat</h1>
        <p className="hero__subtitle">
          Search by food type, explore ranked restaurants, and share your reviews.
        </p>
        <SearchBar large />
      </section>
    </div>
  )
}
