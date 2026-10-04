import { useTheme } from '../context/ThemeContext';

interface FactItem {
  image: string;
  title: string;
  desc: string;
  tag?: string;
}

export const CityFacts = () => {
  const { isDarkMode } = useTheme();

  const facts: FactItem[] = [
    {
      image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=600&q=80',
      title: 'Stolno mjesto kraljeva (Mile)',
      tag: 'Historija 👑',
      desc: 'U Milima pored Visokog krunisan je prvi bosanski kralj Tvrtko I Kotromanić 1377. godine, a tu se nalazila i grobnica kralja Stjepana II Kotromanića.'
    },
    {
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      title: 'Povelja Kulina bana',
      tag: 'Baština 📜',
      desc: 'Rodno mjesto bosanske državnosti. Povelja Kulina bana napisana je 1189. godine na području današnjeg Visokog (lokalitet Biskupatije/Moštra).'
    },
    {
      image: 'https://i0.wp.com/lll.ba/wp-content/uploads/2023/06/Suho-meso-Bosnia-Herzegovina-lll.ba-%40mezzeplattershop-1.jpg?resize=1024%2C1024&ssl=1',
      title: 'Zaštićeno suho meso',
      tag: 'Gastronomija 🥩',
      desc: 'Visočko suho meso posjeduje zvaničnu geografsku zaštitu porijekla. Tradicija sušenja na bukovom dimu u pušnicama prenosi se generacijama.'
    },
    {
      image: 'https://cdn.pixabay.com/photo/2021/03/08/12/06/oxford-shoes-6078951_1280.jpg',
      title: 'Tradicija kožarstva',
      tag: 'Zanatsvo 👞',
      desc: 'Visoko je stoljećima centar prerade kože na Balkanu. Prva zanatska zadruga za preradu kože i krzna osnovana je ovdje prije više od 500 godina.'
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Okoliste._Neolithic_settlement_5200_BC._Bosnia_and_Herzegovina_%28cropped%29.jpg?utm_source=hr.wikipedia.org&utm_campaign=index&utm_content=original',
      title: 'Neolitsko naselje Okolišće',
      tag: 'Arheologija 🏺',
      desc: 'Jedno od najvećih neolitskih naselja Butmirske kulture u jugoistočnoj Evropi (oko 5200–4500. p.n.e.). Predstavlja jedno od najranijih protourbanih naselja na Balkanu.'
    },
    {
      image: 'https://etto.ba/uploads/covers/240501040.webp?v=1714561481',
      title: 'Šerefudinova Bijela džamija',
      tag: 'Arhitektura 🕌',
      desc: 'Remek-djelo moderne arhitekture arhitekte Zlatka Ugljena. Godine 1983. dobila je prestižnu međunarodnu Aga Khan nagradu za arhitekturu.'
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Matrak%C3%A7%C4%B1_Nasuh_-_%C4%B0stanbul.jpg?utm_source=bs.wikipedia.org&utm_campaign=index&utm_content=original',
      title: 'Nasuh Matrakčija Visočak',
      tag: 'Značajne ličnosti ⚔️',
      desc: 'Osmanlijski genije i polimat iz 16. stoljeća rođen u Visokom, poznat kao matematičar, historičar i izumitelj borilačke vještine Matrak. Bio je i istaknuti minijaturista, poznat po detaljnim panoramskim prikazima gradova i krajolika.'
    },
    {
      image: 'https://evidentno.ba/wp-content/uploads/2024/11/zaim-muzaferija.jpg',
      title: 'Zaim Muzaferija',
      tag: 'Kultura & Film 🎬',
      desc: 'Legendarni doajen bosanskohercegovačkog glumišta koji je ostvario nezaboravne uloge u filmovima poput "Ovo malo duše" i "Kuduz". Čitav život ostao je vjeran svome Visokom.'
    },
    {
      image: 'https://www.mreza-mira.net/wp-content/uploads/2019/03/visoko.-o-p.jpg',
      title: 'Ajas-beg (Osnivač visočke kasabe)',
      tag: 'Historija & Vakuf 🕌',
      desc: 'Bosanski sandžak-beg čijom je čuvenom vakufnamom iz 1477. godine započela urbanizacija Visokog. Izgradio je hamam, mekteb, vodovod, most i dućane, postavivši temelje čaršije.'
    }
  ];

  return (
    <section style={{ padding: '2rem 0', marginTop: '1rem' }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '800',
        marginBottom: '1.75rem',
        textAlign: 'center',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        letterSpacing: '-0.01em'
      }}>
         Jeste li znali? - Zanimljivosti o Visokom
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.75rem'
      }}>
        {facts.map((f, i) => (
          <div key={i} style={{
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
            boxShadow: isDarkMode ? '0 6px 18px rgba(0,0,0,0.35)' : '0 6px 15px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.25 ease, box-shadow 0.25s ease'
          }}>
            <div style={{
              position: 'relative',
              height: '160px',
              width: '100%',
              backgroundColor: '#0f172a',
              overflow: 'hidden'
            }}>
              <img
                src={f.image}
                alt={f.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)'
              }} />

              {f.tag && (
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  color: '#38bdf8',
                  backdropFilter: 'blur(6px)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  {f.tag}
                </span>
              )}
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                marginBottom: '0.6rem',
                color: isDarkMode ? '#f8fafc' : '#0f172a',
                lineHeight: 1.3
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: isDarkMode ? '#cbd5e1' : '#64748b',
                lineHeight: '1.55',
                margin: 0
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};