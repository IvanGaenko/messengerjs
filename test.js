const salaries = {
  Manager: {
    salary: 1000,
    tax: "10%",
  },
  Designer: {
    salary: 600,
    tax: "30%",
  },
  Artist: {
    salary: 1500,
    tax: "15%",
  },
};

const team = [
  {
    name: "Misha",
    specialization: "Manager",
  },
  { name: "Max", specialization: "Designer" },
  { name: "Vova", specialization: "Designer" },
  { name: "Leo", specialization: "Artist" },
];

// {
//   totalBudgetTeam:4590,
//   totalBudgetManager: 1111,
//   totalBudgetDesigner: 1714,
//   totalBudgetArtist: 1764,
// }

function calculateTeamFinanceReport(salaries, team) {
  const financeReport = {
    totalBudgetTeam: 0,
  };

  for (let i = 0; i < team.length; i++) {
    const memberSpec = team[i].specialization.toLowerCase();
    const memberSalaryData = salaries[memberSpec];

    if (memberSalaryData !== undefined) {
      const taxPercent = parseInt(memberSalaryData.tax, 10) / 100 + 1;
      const salaryWithTax = Math.round(memberSalaryData.salary * taxPercent);

      if (financeReport[`totalBudget${memberSpec}`] === undefined) {
        financeReport[`totalBudget${memberSpec}`] = 0;
      }

      financeReport[`totalBudget${memberSpec}`] += salaryWithTax;
      financeReport.totalBudgetTeam += salaryWithTax;
    }
  }
  return financeReport;
}

const financeReport = calculateTeamFinanceReport(salaries, team);

console.log("financeReport", financeReport);

// wt --window 0 -p "Windows Powershell" -d . powershell -noExit "npm run startMongo"`;  split-pane --horizontal -p "Windows Powershell" -d . powershell -noExit "npm run gulp-watch"`;  new-tab -p "Windows Powershell" -d . powershell -noExit "npm run local"
