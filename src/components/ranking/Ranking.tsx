import styles from '@/components/ranking/styles/ranking.module.scss';

interface Pet {
  id: number;
  name: string;
  img: string;
  rank: number;
}

interface RankingProps {
  title: string;
  pets: Pet[];
}

export default function Ranking({ title, pets }: RankingProps) {
  return (
    <div className={styles.rankingSection}>
      <h3>{title}</h3>
      <div className={styles.podium}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`${styles.podiumItem} ${styles[`rank${pet.rank}`]}`}
          >
            <img src={pet.img} alt={pet.name} className={styles.petImage} />
            <div className={styles.rankLabel}>{pet.rank}등</div>
            <div className={styles.petName}>{pet.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
