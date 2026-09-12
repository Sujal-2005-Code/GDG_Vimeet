const ComingSoon = () => {
  return (
    <section className="entrance-message">
      <div className="h-full w-full flex flex-col justify-center items-center gap-10">
        <img src="/images/logo.webp" alt="GDG ViMEET logo" className="2xl:w-72 3xl:w-80 md:w-60 w-48" loading="lazy" />

        <div className="text-wrapper text-center">
          <h3 className="gradient-title">
            ViMEET <br /> 2026-27
          </h3>
          <p className="text-white/80 md:text-lg text-base mt-4 max-w-xl mx-auto px-4">
            Build. Create. Connect. Go Beyond.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ComingSoon