function getGradePoint(marks) {
    if (marks < 30) return { grade: 'F', points: 0 };
    if (marks < 40) return { grade: 'D', points: 4 };
    if (marks < 50) return { grade: 'C', points: 5 };
    if (marks < 60) return { grade: 'C+', points: 6 };
    if (marks < 70) return { grade: 'B', points: 7 };
    if (marks < 80) return { grade: 'B+', points: 8 };
    if (marks < 90) return { grade: 'A', points: 9 };
    return { grade: 'A+', points: 10 };
}

function validateInput(value, max) {
    if (value === '') return 0;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return 0;
    return Math.min(num, max);
}

function calculateTheoryMarks(t1Id, t2Id, t3Id, internalId) {
    const t1 = validateInput(document.getElementById(t1Id).value, 20);
    const t2 = validateInput(document.getElementById(t2Id).value, 20);
    const t3 = validateInput(document.getElementById(t3Id).value, 35);
    const internal = validateInput(document.getElementById(internalId).value, 25);
    return t1 + t2 + t3 + internal;
}

function calculatePracticalMarks(midId, endId, internalId, midMax, endMax, internalMax) {
    const mid = validateInput(document.getElementById(midId).value, midMax);
    const end = validateInput(document.getElementById(endId).value, endMax);
    const internal = validateInput(document.getElementById(internalId).value, internalMax);
    return mid + end + internal;
}

function calculateSGPA() {
    const results = [];
    let totalCredits = 0;
    let totalGradePoints = 0;

    // Theory Subjects (4 credits each)
    const theorySubjects = [
        {
            name: 'Mathematics-2',
            marks: calculateTheoryMarks('math-t1', 'math-t2', 'math-t3', 'math-internal'),
            credits: 4
        },
        {
            name: 'SDF-2',
            marks: calculateTheoryMarks('sdf-t1', 'sdf-t2', 'sdf-t3', 'sdf-internal'),
            credits: 4
        },
        {
            name: 'Physics-2',
            marks: calculateTheoryMarks('physics-t1', 'physics-t2', 'physics-t3', 'physics-internal'),
            credits: 4
        }
    ];

    // Practical Subjects
    const practicalSubjects = [
        {
            name: 'UHV',
            marks: calculatePracticalMarks('uhv-mid', 'uhv-end', 'uhv-internal', 30, 30, 40),
            credits: 3
        },
        {
            name: 'Engineering Drawing',
            marks: calculatePracticalMarks('ed-mid', 'ed-end', 'ed-internal', 20, 20, 60),
            credits: 1.5
        },
        {
            name: 'Physics Lab',
            marks: calculatePracticalMarks('plab-mid', 'plab-end', 'plab-internal', 20, 20, 60),
            credits: 1
        },
        {
            name: 'SDF Lab',
            marks: calculatePracticalMarks('sdflab-mid', 'sdflab-end', 'sdflab-internal', 20, 20, 60),
            credits: 1
        }
    ];

    // Calculate results for all subjects
    const allSubjects = [...theorySubjects, ...practicalSubjects];
    allSubjects.forEach(subject => {
        const gradeInfo = getGradePoint(subject.marks);
        totalCredits += subject.credits;
        totalGradePoints += (gradeInfo.points * subject.credits);
        results.push({
            name: subject.name,
            marks: subject.marks,
            grade: gradeInfo.grade,
            points: gradeInfo.points,
            credits: subject.credits
        });
    });

    // Display results
    const resultSection = document.getElementById('result');
    const subjectResults = document.getElementById('subject-results');
    const sgpaResult = document.getElementById('sgpa-result');
    
    subjectResults.innerHTML = results.map(result => `
        <div class="subject-result">
            <strong>${result.name}</strong>: 
            Total Marks: ${result.marks.toFixed(2)}, 
            Grade: ${result.grade}, 
            Grade Points: ${result.points}
        </div>
    `).join('');

    const sgpa = totalGradePoints / totalCredits;
    sgpaResult.innerHTML = `
        <strong>SGPA: ${sgpa.toFixed(2)}</strong><br>
        Total Credits: ${totalCredits}<br>
        Total Grade Points: ${totalGradePoints.toFixed(2)}
    `;

    // Store the calculated SGPA for CGPA calculation
    window.calculatedSGPA = sgpa;

    resultSection.classList.add('visible');
}

function calculateCGPA() {
    const sgpa1 = parseFloat(document.getElementById('sgpa1').value);
    const resultElement = document.getElementById('cgpa-result');
    
    if (isNaN(sgpa1)) {
        resultElement.innerHTML = "Please enter a valid Semester 1 SGPA";
        resultElement.style.backgroundColor = "#f8d7da";
        resultElement.style.color = "#721c24";
        return;
    }
    
    // Use the calculated SGPA from Semester 2 if available
    const sgpa2 = window.calculatedSGPA || 0;
    
    if (sgpa2 === 0) {
        resultElement.innerHTML = "Please calculate Semester 2 SGPA first";
        resultElement.style.backgroundColor = "#f8d7da";
        resultElement.style.color = "#721c24";
        return;
    }
    
    const cgpa = (0.548 * sgpa1 + 0.452 * sgpa2);
    
    resultElement.innerHTML = `
        <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; color: #155724;">
            <strong style="font-size: 1.2em;">Final CGPA: ${cgpa.toFixed(2)}</strong><br><br>
            Calculation Details:<br>
            • Semester 1 SGPA: ${sgpa1.toFixed(2)} (Weight: 54.8%)<br>
            • Semester 2 SGPA: ${sgpa2.toFixed(2)} (Weight: 45.2%)
        </div>
    `;
}
