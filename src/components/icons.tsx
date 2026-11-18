import type { SVGProps } from 'react'
import {
  siC,
  siCodeforces,
  siCplusplus,
  siDjango,
  siDocker,
  siFastapi,
  siFirebase,
  siGit,
  siGithub,
  siLeetcode,
  siPandas,
  siPytest,
  siPython,
  siReact,
  siRos,
} from 'simple-icons'

type IconProps = SVGProps<SVGSVGElement> & { title?: string }

function make(path: string, name: string) {
  function BrandIcon({ title, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        aria-label={title}
        {...props}
      >
        <path d={path} />
      </svg>
    )
  }
  BrandIcon.displayName = `${name}Icon`
  return BrandIcon
}

// Brand marks come from Simple Icons (CC0). LinkedIn is no longer shipped there,
// so its glyph is inlined.
const LINKEDIN =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

export const GithubIcon = make(siGithub.path, 'Github')
export const LinkedinIcon = make(LINKEDIN, 'Linkedin')
export const LeetcodeIcon = make(siLeetcode.path, 'Leetcode')
export const CodeforcesIcon = make(siCodeforces.path, 'Codeforces')

/** Logos for the scrolling strip in the Skills section. */
export const techLogos = [
  { name: 'Python', Icon: make(siPython.path, 'Python') },
  { name: 'C++', Icon: make(siCplusplus.path, 'Cplusplus') },
  { name: 'C', Icon: make(siC.path, 'C') },
  { name: 'FastAPI', Icon: make(siFastapi.path, 'Fastapi') },
  { name: 'React', Icon: make(siReact.path, 'React') },
  { name: 'ROS', Icon: make(siRos.path, 'Ros') },
  { name: 'Pandas', Icon: make(siPandas.path, 'Pandas') },
  { name: 'Pytest', Icon: make(siPytest.path, 'Pytest') },
  { name: 'Docker', Icon: make(siDocker.path, 'Docker') },
  { name: 'Firebase', Icon: make(siFirebase.path, 'Firebase') },
  { name: 'Django', Icon: make(siDjango.path, 'Django') },
  { name: 'Git', Icon: make(siGit.path, 'Git') },
]
