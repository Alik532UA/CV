<!-- Y Ddraig Goch reduced to plain shapes (body, neck, head, wing, tail,
     legs) rather than a traced heraldic outline — the fine linework of the
     real dragon does not survive at icon size anyway, and simple primitives
     render predictably instead of risking a malformed hand-drawn path. -->
<svg
    width="32"
    height="24"
    viewBox="0 0 32 24"
    preserveAspectRatio="xMidYMid slice"
    {...$$restProps}
>
    <rect width="32" height="12" y="0" fill="#fff" />
    <rect width="32" height="12" y="12" fill="#00AB39" />
    <g fill="#C8102E">
        <!-- body -->
        <ellipse cx="15" cy="17.5" rx="6" ry="3.2" />
        <!-- neck + head -->
        <path d="M18 15.5 L23 9.5 L26.5 10.5 L23.5 12 L22 15 Z" />
        <!-- wing -->
        <path d="M13 15 L17 8.5 L19.5 11.5 L15.5 16 Z" />
        <!-- tail -->
        <path d="M9.5 18.5 L5 15.5 L7 15 L10.5 17 Z" />
        <!-- front leg -->
        <path d="M17.5 20 L16.5 22.5 L15 22.5 L16 19.7 Z" />
        <!-- back leg -->
        <path d="M12.5 20 L11.5 22.5 L10 22.5 L11 19.7 Z" />
    </g>
</svg>
