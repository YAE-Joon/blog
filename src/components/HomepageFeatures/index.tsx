import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '무엇을 다루나요? 🔍',
    Svg: require('@site/static/img/left icon.svg').default,
    description: (
      <>
        - 💡 Java, Spring Boot 개발 경험<br/>
        - 🌐 웹 개발 기술과 트렌드<br/>
        - 📚 학습한 기술들의 깊이 있는 이해<br/>
        - 🚀 개인 프로젝트와 코딩 경험 공유<br/>
      </>
    ),
  },
  {
    title: '안녕하세요! 제 블로그에 오신 것을 환영합니다. 🙌',
    Svg: require('@site/static/img/center icon.svg').default,
    description: (
      <>
        개발의 세계는 끊임없이 변화하는 넓은 숲과 같습니다.<br/>
        여기서 제 학습 여정과 성장의 이야기를 나누고자 합니다.
      </>
    ),
  },
  {
    title: '블로그의 목표 🎯',
    Svg: require('@site/static/img/right icon.svg').default,
    description: (
      <>
        - 꾸준히 성장하는 개발자의 모습 기록<br/>
        - 제 경험을 통해 다른 개발자들에게 인사이트 제공<br/>
        - 기술적 도전과 학습의 과정 공유

      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
