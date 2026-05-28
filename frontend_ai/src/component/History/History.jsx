import React, { useContext, useEffect, useState } from 'react'
import styles from './History.module.css'
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userinfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/resume/getresumes/${userinfo._id}`);
        setData(response.data.resumes);
      } catch (err) {
        console.log(err);
        alert("Failed to fetch history. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={styles.History}>
      <div className={styles.HistoryCardBlock}>

        {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={340}
              className={styles.HistoryCard}
              sx={{ borderRadius: "18px" }}
            />
          ))
        )}

        {!loading && data.map((item) => (
          <div key={item._id} className={styles.HistoryCard}>

            <div className={styles.CardPercentage}>{item.score}%</div>

            <h2 className={styles.JobTitle}>{item.jobTitle}</h2>

            <p className={styles.ResumeName}>Resume: {item.resumeName}</p>

            <div className={styles.SkillSection}>
              <p className={styles.SkillLabel}>Matched Skills</p>
              <div className={styles.SkillTags}>
                {item.matchedSkills?.map((skill, i) => (
                  <span key={i} className={styles.TagGreen}>{skill}</span>
                ))}
              </div>
            </div>

            <div className={styles.SkillSection}>
              <p className={styles.SkillLabel}>Missing Skills</p>
              <div className={styles.SkillTags}>
                {item.missingSkills?.map((skill, i) => (
                  <span key={i} className={styles.TagRed}>{skill}</span>
                ))}
              </div>
            </div>

            <div className={styles.FeedbackSection}>
              <p className={styles.SkillLabel}>Feedback</p>
              <p className={styles.FeedbackText}>{item.feedback}</p>
            </div>

            <p className={styles.Date}>Dated: {new Date(item.createdAt).toLocaleDateString()}</p>

          </div>
        ))}

      </div>
    </div>
  );
};

export default withAuthHOC(History);