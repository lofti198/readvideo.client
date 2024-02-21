import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (

    // <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100"> {/* Ensure full width */}
    //   <div className="container-fluid"> {/* Use container-fluid for full width */}
    //     <Link to="/" className="navbar-brand">
    //       Site Name
    //     </Link>
    //     <div className="collapse navbar-collapse">
    //       <ul className="navbar-nav ms-auto">
    //         <CustomLink to="/about">About</CustomLink>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>

    <nav className="nav">
      <Link to="/" className="site-title">
        Read Video
      </Link>
      <ul>
        {/* <CustomLink to="/pricing">Pricing</CustomLink> */}
        {/* <CustomLink to="/about">About</CustomLink> */}
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}