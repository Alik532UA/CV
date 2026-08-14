<!-- Stars and Stripes, for American English (en-us). British English keeps the
     Union Jack in FlagEN. At official 1:1.9 proportions this flag is wider than
     the 32×24 box the switcher gives every flag, so it fills the box and crops
     the outer edges ("slice"), exactly as the Union Jack beside it does — fitting
     it whole would leave transparent bands inside a framed, shadowed rectangle.

     The 50 stars are built from one star and two row groups rather than 50
     hand-written shapes: nine rows, alternating six and five. -->
<svg
    width="32"
    height="24"
    viewBox="0 0 7410 3900"
    preserveAspectRatio="xMidYMid slice"
    {...$$restProps}
>
    <rect width="7410" height="3900" fill="#B31942" />
    <!-- The six white stripes; the seven red ones are the field showing through. -->
    <path
        fill="#FFF"
        d="M0,300h7410v300H0zm0,600h7410v300H0zm0,600h7410v300H0zm0,600h7410v300H0zm0,600h7410v300H0zm0,600h7410v300H0z"
    />
    <rect width="2964" height="2100" fill="#0A3161" />
    <defs>
        <path
            id="enus-star"
            fill="#FFF"
            d="M0,-120 27,-37 114,-37 44,14 71,97 0,46 -71,97 -44,14 -114,-37 -27,-37z"
        />
        <g id="enus-row6">
            <use href="#enus-star" x="247" />
            <use href="#enus-star" x="741" />
            <use href="#enus-star" x="1235" />
            <use href="#enus-star" x="1729" />
            <use href="#enus-star" x="2223" />
            <use href="#enus-star" x="2717" />
        </g>
        <g id="enus-row5">
            <use href="#enus-star" x="494" />
            <use href="#enus-star" x="988" />
            <use href="#enus-star" x="1482" />
            <use href="#enus-star" x="1976" />
            <use href="#enus-star" x="2470" />
        </g>
    </defs>
    <use href="#enus-row6" y="210" />
    <use href="#enus-row5" y="420" />
    <use href="#enus-row6" y="630" />
    <use href="#enus-row5" y="840" />
    <use href="#enus-row6" y="1050" />
    <use href="#enus-row5" y="1260" />
    <use href="#enus-row6" y="1470" />
    <use href="#enus-row5" y="1680" />
    <use href="#enus-row6" y="1890" />
</svg>
