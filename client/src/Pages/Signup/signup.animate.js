import gsap from "gsap"

export const animateSignup = (labelRef, formRef) => {

    gsap.fromTo(

        [formRef.current, labelRef.current],
        { opacity: 0 },
        {

            opacity: 1,
            duration: 0.8,
            scrollTrigger: {

                trigger: [formRef.current, labelRef.current],
                toggleActions: 'play none none none'

            }

        }

    )

}

export const animateCountry = (countryRef) => {

    // On initial this ref is not present on DOM
    // It is added only after an event
    if (countryRef.current) {

        gsap.fromTo(

            countryRef.current,
            { opacity: 0 },
            {

                opacity: 1,
                duration: 0.4

            }

        )

    }

}