import { Intro, Breadcrumb, Source } from '@/components/UI';
import DepartmentExplorer from '@/components/DepartmentExplorer';
export const metadata = { title: 'Academic departments' };
export default function Departments() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Departments' }]} />
      <Intro
        number="02"
        title={
          <>
            Follow your curiosity.
            <br />
            <em>Find your discipline.</em>
          </>
        }
        description="Meet the academic disciplines at LNMIIT, from engineering and intelligent systems to fundamental science and the study of society."
      />
      <section className="wrap section compact">
        <DepartmentExplorer />
        <div className="source-note">
          <Source href="/department/" label="Official departments directory" />
          <Source
            href="/department/ai-ds/"
            label="AI & Data Science department"
          />
        </div>
      </section>
    </>
  );
}
