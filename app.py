import pandas as pd
import plotly.express as px
import streamlit as st

# Page configuration
st.set_page_config(
    page_title="Financial Transaction Analyzer", page_icon="💳", layout="wide"
)

st.title("Personal Financial Transaction Analyzer")
st.markdown(
    "Upload a bank or credit card statement to automatically categorize expenses and visualize cash flow."
)

# File uploader widget (encoding='utf-8-sig' strips hidden BOM characters)
uploaded_file = st.file_uploader("Upload CSV Statement", type=["csv"])

if uploaded_file is not None:
  df = pd.read_csv(uploaded_file, encoding="utf-8-sig")
else:
  st.info(
      "No file uploaded yet. Displaying insights from sample dataset below."
  )
  df = pd.read_csv("sample_transactions.csv", encoding="utf-8-sig")


# Robust Data Cleaning & Transformation Pipeline
def process_data(dataframe):
  # Strip whitespace and lowercase all column names for safe matching
  dataframe.columns = [str(col).strip().lower() for col in dataframe.columns]

  # Map common CSV column variations to standard names
  rename_map = {}
  for col in dataframe.columns:
    if "date" in col:
      rename_map[col] = "Date"
    elif any(term in col for term in ["desc", "merchant", "narrative", "memo"]):
      rename_map[col] = "Description"
    elif any(term in col for term in ["amount", "cost", "sum", "value"]):
      rename_map[col] = "Amount"

  dataframe = dataframe.rename(columns=rename_map)

  # Check if required columns exist
  if "Date" not in dataframe.columns or "Amount" not in dataframe.columns:
    st.error(
        "Your CSV must contain at least a 'Date' and an 'Amount' column."
    )
    st.stop()

  # Ensure Date is datetime format
  dataframe["Date"] = pd.to_datetime(dataframe["Date"], errors="coerce")

  # Fill missing descriptions if any
  if "Description" not in dataframe.columns:
    dataframe["Description"] = "Unknown Transaction"

  # Rule-based auto-categorization engine
  def categorize(description):
    desc = str(description).upper()
    if "COSTCO" in desc or "TARGET" in desc or "WHOLE FOODS" in desc:
      return "Groceries & Retail"
    elif "SHELL" in desc or "EXXON" in desc:
      return "Fuel & Transport"
    elif "NETFLIX" in desc or "SPOTIFY" in desc:
      return "Subscriptions"
    elif "UTILITY" in desc or "ELECTRIC" in desc:
      return "Utilities"
    elif "CHIPOTLE" in desc:
      return "Dining Out"
    elif "PMT" in desc or "PAYMENT" in desc:
      return "Payments/Transfers"
    else:
      return "Miscellaneous"

  dataframe["Category"] = dataframe["Description"].apply(categorize)
  return dataframe


df_processed = process_data(df)

# Sidebar filters
st.sidebar.header("Filter Options")
categories = df_processed["Category"].unique()
selected_categories = st.sidebar.multiselect(
    "Select Categories", categories, default=categories
)

filtered_df = df_processed[
    df_processed["Category"].isin(selected_categories)
]

# Key Metric Summaries
total_spend = filtered_df[filtered_df["Amount"] > 0]["Amount"].sum()
transaction_count = len(filtered_df)

col1, col2 = st.columns(2)
col1.metric(label="Total Tracked Spend", value=f"${total_spend:,.2f}")
col2.metric(label="Total Transactions", value=transaction_count)

st.markdown("---")

# Visualizations
col3, col4 = st.columns(2)

with col3:
  st.subheader("Spending by Category")
  category_spend = (
      filtered_df[filtered_df["Amount"] > 0]
      .groupby("Category")["Amount"]
      .sum()
      .reset_index()
  )
  fig_pie = px.pie(
      category_spend,
      names="Category",
      values="Amount",
      hole=0.4,
      color_discrete_sequence=px.colors.sequential.Teal,
  )
  st.plotly_chart(fig_pie, use_container_width=True)

with col4:
  st.subheader("Transactions Over Time")
  fig_line = px.bar(
      filtered_df,
      x="Date",
      y="Amount",
      color="Category",
      title="Daily Cash Flow",
  )
  st.plotly_chart(fig_line, use_container_width=True)

# Data Table view
st.subheader("Processed Transaction Ledger")
st.dataframe(filtered_df, use_container_width=True)