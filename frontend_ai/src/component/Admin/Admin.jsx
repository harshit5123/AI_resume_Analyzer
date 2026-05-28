import React, { useContext, useEffect, useState } from 'react'
import styles from './Admin.module.css'
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Admin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userinfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/resume/getAdmin");
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
    <div className={styles.Admin}>
      <div className={styles.AdminCardBlock}>

        {loading && (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={340}
              className={styles.AdminCard}
              sx={{ borderRadius: "18px" }}
            />
          ))
        )}

        {!loading && data.map((item) => (
          <div key={item._id} className={styles.AdminCard}>

            <div className={styles.CardName}>{item.userId.name}</div>
            <p className={styles.CardEmail}>{item.userId.email}</p>
            <h3 className={styles.CardScore}>Score: {item.score}%</h3>

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
              <p className={styles.FeedbackText}>{item.feedback || "No feedback provided."}</p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default withAuthHOC(Admin);