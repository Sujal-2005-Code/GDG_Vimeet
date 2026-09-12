const ComingSoon = () => {
  return (
    <section className="entrance-message">
      <div className="h-full w-full flex flex-col justify-center items-center gap-10">
        <img src="/images/logo.webp" alt="logo" className="2xl:w-72 3xl:w-80 md:w-60 w-48" />

        <div className="text-wrapper text-center">
          <h3 className="gradient-title">
          ViMEET <br /> 2025-26
          </h3>
        </div>

        <div className="flex justify-center items-center gap-10">
          <img src="/images/ps-logo.png" className="md:w-32 w-20" />
          <img src="/images/x-logo.avif" className="md:w-52 w-40" />
        </div>
      </div>
    </section>
  )
}

export default ComingSoon