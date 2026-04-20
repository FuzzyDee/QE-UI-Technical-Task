Feature: Calculate holiday entitlement on GOV.UK
  As an employer
  I want to calculate statutory holiday entitlement
  So that I can validate expected outcomes and user-input handling

  Background:
    Given I open the holiday entitlement start page

  Scenario: Successful full-year calculation for regular worker on 5 days per week
    When I start the calculator journey
    And I choose regular hours worker
    And I choose entitlement based on days worked per week
    And I choose full leave year
    And I submit days worked per week value "5"
    Then I should see a holiday entitlement result
    And the statutory entitlement should be "28 days holiday"

  Scenario: Validation is shown if first question is skipped
    When I start the calculator journey
    And I continue without answering the irregular-hours question
    Then I should see first-question validation message

  Scenario Outline: Invalid day values are rejected for days-worked flow
    When I start the calculator journey
    And I choose regular hours worker
    And I choose entitlement based on days worked per week
    And I choose full leave year
    And I submit days worked per week value "<days>"
    Then I should remain on days worked per week page
    And I should see days-worked validation message

    Examples:
      | days |
      | 0    |
      | 8    |
      | abc  |

  Scenario: Boundary value 7 days is accepted
    When I start the calculator journey
    And I choose regular hours worker
    And I choose entitlement based on days worked per week
    And I choose full leave year
    And I submit days worked per week value "7"
    Then I should see a holiday entitlement result
    And the statutory entitlement should be "28 days holiday"

  Scenario: Irregular-hours worker starting part way through leave year gets accrued entitlement
    When I start the calculator journey
    And I choose irregular hours or part-year worker
    And I enter the date as "1" "1" "2024"
    And I choose entitlement basis "days worked per week"
    And I choose holiday calculation option "for someone starting part way through a leave year"
    And I enter the date as "1" "2" "2024"
    And I submit days worked per week value "3"
    Then I should see a holiday entitlement result
    And the statutory entitlement should be "15.5 days holiday"
    And the results should mention first-year accrual guidance

  Scenario: Irregular-hours worker leaving part way through leave year gets pro-rated entitlement
    When I start the calculator journey
    And I choose irregular hours or part-year worker
    And I enter the date as "1" "1" "2024"
    And I choose entitlement basis "days worked per week"
    And I choose holiday calculation option "for someone leaving part way through a leave year"
    And I enter the date as "1" "2" "2024"
    And I submit days worked per week value "3"
    Then I should see a holiday entitlement result
    And the statutory entitlement should be "1.5 days holiday"

  Scenario: Validate deep-link questionnaire answers for regular full-year 3.0 days
    Given I open the holiday entitlement page "https://www.gov.uk/calculate-your-holiday-entitlement/y/regular/days-worked-per-week/full-year/3.0"
    Then I should see a holiday entitlement result
    And the statutory entitlement should be "16.8 days holiday"
    And the result summary should include "Does the employee work irregular hours or for part of the year? No"
    And the result summary should include "Is the holiday entitlement based on: days worked per week"
    And the result summary should include "Do you want to work out holiday: for a full leave year"
    And the result summary should include "Number of days worked per week? 3.0"

  Scenario Outline: Full-year regular worker supports each entitlement basis option
    When I start the calculator journey
    And I choose regular hours worker
    And I choose entitlement basis "<basis>"
    And I choose full leave year
    And I complete full-year inputs for entitlement basis "<basis>"
    Then I should see a holiday entitlement result
    And the result summary should include "Is the holiday entitlement based on: <basis>"

    Examples:
      | basis                |
      | days worked per week |
      | hours worked per week|
      | annualised hours     |
      | compressed hours     |
      | shifts               |