import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import ArticleIcon from "@mui/icons-material/Article";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from "@mui/material/Skeleton";
import withAuthHOC from "../../utils/HOC/withAuthHOC";
import axios from "../../utils/axios";
import { AuthContext } from "../../utils/AuthContext";

const Dashboard = () => {

  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const { userinfo } = React.useContext(AuthContext);
  console.log("userinfo:", userinfo);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Upload resume and fill job description.");
      return;
    }

    if (!userinfo) {
      alert("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("userId", userinfo._id);

    try {
      setLoading(true);
      const response = await axios.post('/api/resume/addresume', formData);
      setResult(response.data.analysis);
    }
    catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    }
    finally {
      setLoading(false);
    }

    console.log("Analyzing...");
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.left}>
        <h1 className={styles.title}>Smart Resume Screening</h1>
        <h2 className={styles.score}>Resume Match Score</h2>

        {/* Instructions */}
        <div className={styles.instructions}>
          <div className={styles.instructionsTitle}>
            <NotificationImportantIcon className={styles.iconWarning} />
            Important Instructions :
          </div>

          <div className={styles.instructionItem}>
            <ArticleIcon className={styles.iconLight} />
            Paste complete job description for accurate analysis.
          </div>

          <div className={styles.instructionItem}>
            <AttachFileIcon className={styles.iconLight} />
            Upload resume only in PDF format.
          </div>
        </div>

        {/* Upload Section */}
        <div className={styles.section}>
          <p className={styles.sectionText}>
            Upload resume and job description for detailed analysis:
          </p>

          <label className={styles.buttonPrimary}>
            <div>{file ? file.name : "Upload PDF"}</div>
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Job Description */}
        <div className={styles.section}>
          <textarea
            className={styles.textarea}
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <button className={styles.buttonPrimary} onClick={handleAnalyze}>
          Analyze
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.analysisPlaceholder}>
          <div className={styles.analysisText}>Analyze with AI</div>
          <img className={styles.profileImg} src={userinfo?.photoUrl} alt="Profile Image" />
          <h2>{userinfo?.name || "User"}</h2>
        </div>



        {
          result && (
            <div className={styles.analysisPlaceholder}>
              <div className={styles.analysisText}>Result</div>

              <div className={styles.resultScore}>
                {result.score}%
                <CreditScoreIcon className={styles.resultIcon} />
              </div>

              <div className={styles.resultText}>
                <h2>Matched Skills :</h2>
                <div className={styles.skillTags}>
                  {result.matchedSkills.map((skill, index) => (
                    <span key={index} className={styles.skillTagGreen}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.resultText}>
                <h2>Missing Skills :</h2>
                <div className={styles.skillTags}>
                  {result.missingSkills.map((skill, index) => (
                    <span key={index} className={styles.skillTagRed}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.resultText}>
                <h2>Feedback :</h2>
                <p className={styles.feedback}>{result.feedback}</p>
              </div>
            </div>
          )
        }

        {
          loading && (
            <Skeleton
              variant="rectangular"
              width={300}
              height={500}
              sx={{ borderRadius: "20px" }}
            />
          )
        }

      </div>
    </div>
  );
};

export default withAuthHOC(Dashboard);